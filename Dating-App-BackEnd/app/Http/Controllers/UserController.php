<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Block;
use App\Models\Message;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Ramsey\Uuid\Type\Integer;
use App\Models\User_information;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    function GetAllUsers(Request $request, $var1 = 0, $var2 = 0){
        
        if($request->gender_id == 1){
            $gender_to_search = 2;
        }else{
            $gender_to_search = 1;
        }

        if($var1 != 0){
            if($var2 != 0){
                $users = User::where("age", "=", $var1)
                            ->where("gender_id", "=", $gender_to_search)
                            ->where("location", "=", $var2)
                            ->get();
                    return response()->json([
                        "users" => $users
                    ]);
            }else{
                if(filter_var($var1, FILTER_VALIDATE_INT)){
                    $users = User::where("age", "=", $var1)
                                ->where("gender_id", "=", $gender_to_search)
                                ->get();
                    return response()->json([
                        "users" => $users
                    ]);
                }else{
                    $users = User::where("location", "=", $var1)
                                ->where("gender_id", "=", $gender_to_search)
                                ->get();
                    return response()->json([
                        "users" => $users
                    ]);
                }
            }
        }else{
            if(isset($request->name)){
                $users = User::where("gender_id", "=", $gender_to_search)
                            ->where("name", "like", "%".$request->name."%")
                            ->get();
                return response()->json([
                    "users" => $users
                ]);
            }else if(isset($request->id)){
                $users = User::where("id", "=", $request->id)
                            ->get();
                return response()->json([
                    "users" => $users
                ]);
            }else{
                $users = User::where("gender_id", "=", $gender_to_search)->get();
                return response()->json([
                    "users" => $users
                ]);
            }
        }
    }


    function FavoriteUser(Request $request){
        $user_who_favorited_id = $request->user_who_favorited_id;
        $favorited_user_id = $request->favorited_user_id;

        $favorite_exists = Favorite::where("user_who_favorited_id", "=", $user_who_favorited_id)
                                    ->where("favorited_user_id", "=", $favorited_user_id)
                                    ->count(); // or use first();

        if($favorite_exists > 0){
            return response()->json([
                "status" => "Already Favorited!"
            ]);
        }else{
            $favorite = new Favorite;
            $favorite->user_who_favorited_id = $request->user_who_favorited_id;
            $favorite->favorited_user_id = $request->favorited_user_id;
            $favorite->save();
            return response()->json([
                "status" => "Favorited!"
            ]);
        }
    }

    function BlockUser(Request $request){
        $user_who_blocked_id = $request->user_who_blocked_id;
        $blocked_user_id = $request->blocked_user_id;

        $block_exists = Block::where("user_who_blocked_id", "=", $user_who_blocked_id)
                                ->where("blocked_user_id", "=", $blocked_user_id)
                                ->count();

        if($block_exists > 0){
            return response()->json([
                "status" => "Already Blocked!"
            ]);
        }else{
            $block = new Block;
            $block->user_who_blocked_id = $request->user_who_blocked_id;
            $block->blocked_user_id = $request->blocked_user_id;
            $block->save();
            return response()->json([
                "status" => "Blocked!"
            ]);
            // $insert_block = Block::insert([
            //     "user_who_blocked_id" => $request->user_who_blocked_id,
            //     "blocked_user_id" => $request->blocked_user_id
            // ]);
            // $update_block = Block::where()->first();
            // $update_block->update([

            // ]);
            
        }
    }

    function MessageUser(Request $request){
        $message = new Message;
        $message->receiver_id = $request->receiver_id;
        $message->sender_id = $request->sender_id;
        $message->message = $request->message;
        $message->save();

        return response()->json([
            "status" => "Message Sent!"
        ]);
        
    }

    function GetAllFavorites(Request $request){
        $favorited_user_id = $request->favorited_user_id;
        $favorites = Favorite::join("users", "favorites.user_who_favorited_id", "=", "users.id")
                            ->select("favorites.*", "users.name" )
                            ->where("favorited_user_id", "=", $favorited_user_id)
                            ->get();
        return response()->json([
            "favorites" => $favorites
        ]);
    }

    function GetAllBlocks(Request $request){
        $blocked_user_id = $request->blocked_user_id;
        $blocks = Block::join("users", "blocks.user_who_blocked_id", "=", "users.id")
                            ->select("blocks.*", "users.name" )
                            ->where("blocked_user_id", "=", $blocked_user_id)
                            ->get();
        return response()->json([
            "blocks" => $blocks
        ]);
    }

    function GetAllMessages(Request $request){
        $receiver_id = $request->receiver_id;
        $messages = Message::join("users", "messages.sender_id", "=", "users.id")
                            ->select("messages.*", "users.name" )
                            ->where("receiver_id", "=", $receiver_id)
                            ->get();
        return response()->json([
            "messages" => $messages
        ]);
    }

    function ResetPassword(Request $request){
        $user = User::find($request->id);
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            "status" => "Password Updated!"
        ]);
    }

    function EditProfile(Request $request){
        $user_id = $request->user_id;
        $user_info_exists = User_information::where('user_id', '=', $user_id)->count();

        if($user_info_exists > 0){
            $user_info = User_information::find($user_id);
        }else{
            $user_info = new User_information;
        }

        if(isset($request->description)){
            $user_info->description = $request->description;
        }
        if(isset($request->additional_picture1)){
            $additional_picture1 = $request->additional_picture1;
            $additional_picture1 = str_replace('data:image/jpeg;base64,', '', $additional_picture1);
            $additional_picture1 = str_replace(' ', '+', $additional_picture1);
            $decoded_additional_picture1 = base64_decode($additional_picture1);
            $image_name = $user_id . "pic1" . "." . "jpg";
            Storage::disk('public')->put('additional_pictures/' . $image_name, $decoded_additional_picture1);
            $user_info->additional_picture1 = 'additional_pictures/' . $image_name;
        }
        if(isset($request->additional_picture2)){
            $additional_picture2 = $request->additional_picture2;
            $additional_picture2 = str_replace('data:image/jpeg;base64,', '', $additional_picture2);
            $additional_picture2 = str_replace(' ', '+', $additional_picture2);
            $decoded_additional_picture2 = base64_decode($additional_picture2);
            $image_name = $user_id . "pic2" . "." . "jpg";
            Storage::disk('public')->put('additional_pictures/' . $image_name, $decoded_additional_picture2);
            $user_info->additional_picture2 = 'additional_pictures/' . $image_name;
        }
        if(isset($request->additional_picture3)){
            $additional_picture3 = $request->additional_picture3;
            $additional_picture3 = str_replace('data:image/jpeg;base64,', '', $additional_picture3);
            $additional_picture3 = str_replace(' ', '+', $additional_picture3);
            $decoded_additional_picture3 = base64_decode($additional_picture3);
            $image_name = $user_id . "pic3" . "." . "jpg";
            Storage::disk('public')->put('additional_pictures/' . $image_name, $decoded_additional_picture3);
            $user_info->additional_picture3 = 'additional_pictures/' . $image_name;
        }
        $user_info->user_id = $request->user_id;
        $user_info->save();

        return response()->json([
            "status" => "User Information Edited!"
        ]);
    }

    function GetUserInfo(Request $request) {
        $user_info = User_information::find($request->user_id);
        $user_info->save();
        return response()->json([
            "user_info" => $user_info
        ]);
    }
}
