<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\SectionMissing;
use App\Exceptions\TextMatchInvalid;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Exceptions\DraftConflict;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Domain\Documents\Values\DraftTarget;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;

/**
 * A save replaces text in the open draft; a save on an old version, an edit with no open draft and an edit the text
 * refuses name their cause and change nothing.
 */
#[TestsCommand(ReplaceDocumentTextCommand::class)]
final class ReplaceDocumentTextTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'command_receipts',
        'links',
        'text_uploads',
        'text_upload_chunks',
        'comments',
    ];

    private const string BODY = <<<'TEXT'
    # Goal
    Ship it.

    ## Steps
    One.

    ## Risks
    None.

    TEXT;

    private const string REPLACEMENT = 'Replacement text.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(1));
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::BODY));
    }

    public function test_a_save_on_an_old_version_is_refused_and_the_first_save_stands(): void
    {
        $opened = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($opened->target(), 'One.', 'Two.'));

        try {
            $this->bus()->run(new ReplaceDocumentTextCommand($opened->target(), 'One.', 'Three.'));
            $this->fail('A save on an old version was accepted.');
        } catch (DraftConflict) {
            $this->assertStringContainsString('Two.', DocumentDraft::query()->sole()->body);
        }
    }

    public function test_refused_edits_name_their_cause_and_change_nothing(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));

        $refusals = [
            [new ReplaceDocumentTextCommand($draft->target(), '.', '!'), TextMatchInvalid::class],
            [
                new EditDocumentCommand($draft->target(), 'Missing', <<<'TEXT'
                ## Missing
                Text.

                TEXT),
                SectionMissing::class,
            ],
        ];

        foreach ($refusals as [$command, $refusal]) {
            try {
                $this->bus()->run($command);
                $this->fail('A refused edit was accepted.');
            } catch (TextMatchInvalid|SectionMissing $refused) {
                $this->assertInstanceOf($refusal, $refused);
            }
        }

        $this->assertSame(1, DocumentDraft::query()->sole()->version);
    }

    public function test_an_edit_without_an_open_draft_names_doc_open(): void
    {
        $this->expectException(DraftMissing::class);
        $this->expectExceptionMessage(DraftMissing::forDocument(1)->getMessage());

        $this->bus()->run(new ReplaceDocumentTextCommand(new DraftTarget('1', 'unknown', 1), 'One.', 'Two.'));
    }

    public function test_signed_text_replacement_accepts_the_old_and_new_wire_fields(): void
    {
        $author = $this->journal->signedStart('Writer', 'writing-helper');
        $author->startRequest($this->app);
        $commands = $this->app->make(CommandBus::class);
        $document = $commands->run(new CreateDocumentCommand('Design', 'Current design.', 'Original text.'));
        $draft = $commands->run(new OpenDocumentCommand($document->id, 1));

        $this->journal->agentCall($author, 'POST', '/agent/docs/edit', [
            'number' => (string) $document->number,
            'token' => $draft->token,
            'version' => 1,
            'mode' => 'text',
            'section' => null,
            'body' => null,
            'old' => 'Original text.',
            'new' => self::REPLACEMENT,
            'title' => null,
            'abstract' => null,
            'request_key' => 'replace-design-words',
        ])->assertOk();

        $author->startRequest($this->app);

        $this->assertSame(
            self::REPLACEMENT,
            $this->app->make(DraftResolver::class)->current($document->number)->body,
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
