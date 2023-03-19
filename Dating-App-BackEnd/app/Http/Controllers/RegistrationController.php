<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{
    function register(Request $request) {
        
        $email = $request->email;
        $user_exists = User::where('email', '=', $email)->count();
        if($user_exists > 0){
            return response()->json([
                'response' => "user exists"
            ]);
        }else{
            $user = new User;
            $user->email = $request->email;        
            $user->password = Hash::make($request->password);
            $user->name = $request->name;
            $user->gender_id = $request->gender_id;
            $user->age = $request->age;
            $user->location = $request->location;
            $user->profile_picture = $request->profile_picture;
            $user->save();
            return response()->json([
                'response' => "user added"
            ]);
        }

    }
}
