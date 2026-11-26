<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Contracts\Admission\JournalAdmission;
use App\Enums\Asks\OwnerRouteType;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\SupervisorOwner;
use Tests\TestCase;

final class SupervisorRoutesTest extends TestCase
{
    public function test_the_owner_target_has_an_explicit_missing_outcome(): void
    {
        $this->mock(JournalAdmission::class)->shouldReceive('owner')->andThrow(ConsoleOwnerMissing::forConsole());

        $this->assertSame(OwnerRouteType::NoOwner, $this->app->make(SupervisorOwner::class)->resolve()->type);
    }
}
