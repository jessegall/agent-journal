<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Domain\Access\Api\Viewer;
use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Access\Models\User;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Contracts\Auth\Guard;

/**
 * Reads the signed-in user of this request's session and hands on only their id and display name.
 */
#[Scoped]
final readonly class ViewerRecords implements ViewerReader
{
    public function __construct(private Guard $auth) {}

    public function viewer(): Viewer|null
    {
        $user = $this->auth->user();

        return $user instanceof User ? new Viewer($user->id, $user->name) : null;
    }
}
