<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Actors\Contracts\CurrentUserResolver as CurrentUserResolverContract;
use App\Actors\CurrentUser;
use App\Models\Access\User;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Auth\Guard;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads the signed-in user of this request's session and hands on only their id and display name.
 */
#[Scoped]
final readonly class CurrentUserResolver implements CurrentUserResolverContract
{
    public function __construct(private Guard $auth) {}

    public function currentUser(): Option
    {
        $user = $this->auth->user();

        if ($user instanceof User) {
            return new Some(new CurrentUser($user->id, $user->name));
        }

        return None::create();
    }
}
