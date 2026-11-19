<?php

declare(strict_types=1);

namespace Domain\Access\Resolvers;

use App\Actors\Support\CurrentUser;
use App\Web\Contracts\CurrentUserResolver;
use Domain\Access\Models\User;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Auth\Guard;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads the signed-in user of this request's session and hands on only their id and display name.
 */
#[Scoped]
final readonly class CurrentUserRecords implements CurrentUserResolver
{
    public function __construct(private Guard $auth) {}

    public function currentUser(): Option
    {
        $user = $this->auth->user();

        return $user instanceof User ? new Some(new CurrentUser($user->id, $user->name)) : None::create();
    }
}
