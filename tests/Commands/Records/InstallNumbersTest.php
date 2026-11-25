<?php

declare(strict_types=1);

namespace Tests\Commands\Records;

use App\Commands\Records\InstallNumbers\InstallNumbersCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Records\GlobalGroup;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Installing the journal's numbers makes its one number group, and installing again keeps that one.
 */
#[TestsCommand(InstallNumbersCommand::class)]
final class InstallNumbersTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRUSTED_ENTRY = 'number install';

    public function test_the_journal_number_group_is_made_once(): void
    {
        GlobalGroup::query()->delete();

        $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallNumbersCommand());
        $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallNumbersCommand());

        $this->assertSame(1, GlobalGroup::query()->where('name', GlobalGroup::JOURNAL)->count());
    }
}
