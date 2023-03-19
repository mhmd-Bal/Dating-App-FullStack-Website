<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class RegistrationController extends Controller
{
    function register(Request $request) {
        
        $email = $request->email;
        $user_exists = User::where('email', '=', $email)->count();

        if($user_exists > 0){
            return response()->json([
                'status' => "User Exists!"
            ]);
        }else{
            $profile_picture = $request->profile_picture;
            $profile_picture = str_replace('data:image/jpeg;base64,', '', $profile_picture);
            $profile_picture = str_replace(' ', '+', $profile_picture);
            $decoded_profile_picture = base64_decode($profile_picture);

            $name = $request->name;
            $image_name = $email . "." . "jpg";
            Storage::disk('public')->put('profile_pictures/' . $image_name, $decoded_profile_picture);
            

            $user = new User;
            $user->email = $request->email;        
            $user->password = Hash::make($request->password);
            $user->name = $request->name;
            $user->gender_id = $request->gender_id;
            $user->age = $request->age;
            $user->location = $request->location;
            $user->profile_picture = 'profile_pictures/' . $image_name;
            $user->save();

            return response()->json([
                'status' => "User Added!"
            ]);
        }

    }
}
