<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\Accounts\AccountFolderUses;
use App\Accounts\FolderOrderWait;
use App\Hosts\Enums\HostOrderStatus;
use App\Projects\Enums\ArrangementType;
use App\Values\HostFolderAnswer;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\TestCase;

/**
 * A displaced folder is free on a local host; on a contained host only once the host's folder_use order says no
 * container binds it, and a refused order counts as bound.
 */
final class AccountFolderUsesTest extends TestCase
{
    public function test_a_displaced_folder_is_free_locally_without_asking_the_host(): void
    {
        $host = new RecordingSignInHost(null);

        $isFree = $this->uses($host, ArrangementType::Local)->isDisplacedFolderFree('/accounts/a7', 'a7');

        $this->journal->assertResult([true, []], [$isFree, $host->folderOrders]);
    }

    public function test_a_contained_host_frees_a_folder_only_when_its_order_says_nothing_binds_it(): void
    {
        $host = new RecordingSignInHost(null);
        $free = $this->uses($host, ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7');
        $host->folderAnswer = new HostFolderAnswer(HostOrderStatus::Done, '', true);
        $bound = $this->uses($host, ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7');
        $host->folderAnswer = new HostFolderAnswer(HostOrderStatus::Refused, 'unsafe', false);
        $refused = $this->uses($host, ArrangementType::Contained)->isDisplacedFolderFree('/accounts/a7', 'a7');

        $this->journal->assertResult(
            [true, false, false, [
                'use a7',
                'use a7',
                'use a7',
            ]],
            [$free, $bound, $refused, $host->folderOrders],
        );
    }

    private function uses(RecordingSignInHost $host, ArrangementType $arrangement): AccountFolderUses
    {
        return new AccountFolderUses($host, new FolderOrderWait($host, static fn () => null), $arrangement);
    }
}
