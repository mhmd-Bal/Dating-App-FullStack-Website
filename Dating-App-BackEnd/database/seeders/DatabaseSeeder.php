<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Gender;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Gender::create([
            'gender_type' => 'Male',
        ]);
        
        Gender::create([
            'gender_type' => 'Female',
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'test@test.com',
            'password' => '$2y$10$skgPN1Ux0/NaWc8yrHLbrOUaMcxsGbnW9UzWiQ3EYIcUJKq95o9K.',
            'gender_id' => 1,
            'age' => 23,
            'location' => 'Beirut',
            'profile_picture' => '/here',
        ]);
    }
}
