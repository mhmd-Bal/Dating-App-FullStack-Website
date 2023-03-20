<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Ramsey\Uuid\Type\Integer;

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
            }else{
                $users = User::where("gender_id", "=", $gender_to_search)->get();
                return response()->json([
                    "users" => $users
                ]);
            }
        }
    }
}
