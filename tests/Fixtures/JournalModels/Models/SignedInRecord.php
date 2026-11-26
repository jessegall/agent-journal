<?php

declare(strict_types=1);

namespace Tests\Fixtures\JournalModels\Models;

use App\Models\Support\HasUlidKey;
use Illuminate\Foundation\Auth\User;

/**
 * A model that must extend another Laravel base and takes the journal's key through its trait, which the check passes.
 */
final class SignedInRecord extends User
{
    use HasUlidKey;
}
