<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A user settles a document with a reason, kept trimmed, and a changed revision makes it active again; a blank or
 * long reason, another reason and an open draft are refused, and the same reason again changes nothing.
 */
final class SettleDocumentTest extends TestCase
{
    use CommitsHookRows;

    private const string REASON_REQUIRED = 'reason: The reason field is required.';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(1));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
    }

    public function test_a_user_settles_a_document_with_a_reason_and_a_changed_revision_makes_it_active_again(): void
    {
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));

        $inspection = $this->documents()->inspect(1);
        $this->assertSame(AttentionStatus::Settled, $inspection->attention);
        $this->assertSame(['Shipped.'], array_map(fn ($settlement) => $settlement->reason, $inspection->settlements));

        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Ship it again.'));
        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(AttentionStatus::Active, $this->documents()->inspect(1)->attention);
        $this->assertCount(1, $this->documents()->inspect(1)->settlements);
    }

    public function test_a_blank_reason_another_reason_and_an_open_draft_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->bus()->run(new SettleDocumentCommand(1, 1, '   ')),
            CommandInputInvalid::class,
            self::REASON_REQUIRED,
        );

        $this->assertSame(AttentionStatus::Active, Document::query()->sole()->attention);

        $this->bus()->run(new OpenDocumentCommand('1'));
        $this->expectException(SettlementDenied::class);
        $this->expectExceptionMessage(SettlementDenied::beingEdited(1)->getMessage());

        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Done.'));
    }

    public function test_a_reason_over_its_limit_is_refused_and_the_record_stays_unsettled(): void
    {
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $tooLong = str_repeat('a', Document::SETTLEMENT_REASON_CHARACTER_LIMIT + 1);

        $this->assertThrows(
            fn () => $this->bus()->run(new SettleDocumentCommand(1, 1, $tooLong)),
            CommandInputInvalid::class,
        );

        $this->assertThrows(
            fn () => $this->bus()->run(new CloseReportCommand('1', $tooLong)),
            CommandInputInvalid::class,
        );

        $this->assertSame(
            [
                AttentionStatus::Active,
                AttentionStatus::Active,
            ],
            [
                Document::query()->sole()->attention,
                Report::query()->sole()->attention,
            ],
        );
    }

    public function test_a_reason_is_stored_trimmed_and_the_same_reason_again_changes_nothing(): void
    {
        $this->bus()->run(new SettleDocumentCommand(1, 1, '  Shipped.  '));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));

        $settlements = $this->documents()->inspect(1)->settlements;

        $this->assertSame(['Shipped.'], array_map(fn ($settlement) => $settlement->reason, $settlements));
    }

    private function documents(): DocumentResolver
    {
        return $this->app->make(DocumentResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
