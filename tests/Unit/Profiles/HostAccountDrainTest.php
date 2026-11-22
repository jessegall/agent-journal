<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Enums\ArrangementType;
use App\Support\HostAccountDrain;
use PHPUnit\Framework\TestCase;

final class HostAccountDrainTest extends TestCase
{
    public function test_a_new_accounts_fresh_folder_needs_no_drain(): void
    {
        $this->assertTrue(new HostAccountDrain('/missing/start.sock', ArrangementType::Contained)->drain('/accounts/new', null));
    }

    public function test_a_local_journal_without_a_host_has_nothing_to_drain(): void
    {
        $this->assertTrue(new HostAccountDrain('', ArrangementType::Local)->drain('/accounts/a7', 'a7'));
    }

    public function test_a_contained_journal_without_a_configured_host_refuses(): void
    {
        $this->assertFalse(new HostAccountDrain('', ArrangementType::Contained)->drain('/accounts/a7', 'a7'));
    }

    public function test_a_set_socket_that_is_missing_refuses_in_either_arrangement(): void
    {
        foreach (ArrangementType::cases() as $arrangement) {
            $this->assertFalse(new HostAccountDrain('/missing/start.sock', $arrangement)->drain('/accounts/a7', 'a7'));
        }
    }

    public function test_a_displaced_folder_is_free_locally_once_drained_and_never_free_on_a_contained_host_that_cannot_answer(): void
    {
        $this->assertTrue(new HostAccountDrain('', ArrangementType::Local)->isDisplacedFolderFree('/accounts/a7', 'a7'));
        $this->assertFalse(new HostAccountDrain('', ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7'));
        $this->assertFalse(
            new HostAccountDrain('/missing/start.sock', ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7'),
        );
    }
}
