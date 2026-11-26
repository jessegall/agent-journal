<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Enums\Projects\ArrangementType;
use App\Support\AccountFolderUses;
use PHPUnit\Framework\TestCase;

final class AccountFolderUsesTest extends TestCase
{
    public function test_a_displaced_folder_is_free_locally_and_never_free_on_a_contained_host_that_cannot_answer(): void
    {
        $this->assertTrue(new AccountFolderUses('', ArrangementType::Local)->isDisplacedFolderFree('/accounts/a7', 'a7'));
        $this->assertFalse(new AccountFolderUses('', ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7'));
        $this->assertFalse(
            new AccountFolderUses('/missing/start.sock', ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7'),
        );
    }
}
