<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Ramsey\Uuid\Type\Integer;

class UserController extends Controller
{
    function GetAllUsers($var1 = 0, $var2 = 0, Request $request){
        
        if($request->gender_id == 1){
            $gender_to_search = 2;
        }else{
            $gender_to_search = 1;
        }

        if($var1 != 0){
            if($var2 != 0){
                $users = User::where("age", "=", $var1)
                            ->where("gender_id", "=", $gender_to_search)
                            ->where("location", "=", $var2);
                    return response()->json([
                        "users" => $users
                    ]);
            }else{
                if(gettype($var1) == "integer"){
                    $users = User::where("location", "=", $var1)
                                ->where("gender_id", "=", $gender_to_search);
                    return response()->json([
                        "users" => $users
                    ]);
                }else{
                    $users = User::where("age", "=", $var1)
                                ->where("gender_id", "=", $gender_to_search);
                    return response()->json([
                        "users" => $users
                    ]);
                }
            }
        }else{
            $users = User::all();
            return response()->json([
                "status" => $users
            ]);
        }
    }
}
