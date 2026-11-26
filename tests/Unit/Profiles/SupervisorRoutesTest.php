<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Access\Contracts\JournalAdmission;
use App\Asks\Enums\OwnerRouteType;
use App\Asks\SupervisorOwner;
use App\Exceptions\ConsoleOwnerMissing;
use Tests\TestCase;

final class SupervisorRoutesTest extends TestCase
{
    public function test_the_owner_target_has_an_explicit_missing_outcome(): void
    {
        $this->mock(JournalAdmission::class)->shouldReceive('owner')->andThrow(ConsoleOwnerMissing::forConsole());

        $this->assertSame(OwnerRouteType::NoOwner, $this->app->make(SupervisorOwner::class)->resolve()->type);
    }
}
