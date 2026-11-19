<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use App\Reads\Values\PageSize;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextResolver;
use App\Text\Exceptions\TextLineTooLong;
use App\Text\Exceptions\TextSelectionRefused;
use App\Text\Exceptions\TextVersionUnavailable;
use App\Text\Support\TextSelection;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Core's TextResolver reads a document's or report's text through the record: one version, its sections a page at a
 * time, and bounded parts that read on from where they were cut.
 */
final class TextResolverTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
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

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    public function test_the_current_version_names_its_id_label_and_line_count(): void
    {
        $this->createDocument(<<<'TEXT'
            # Goal
            Ship it.

            TEXT);

        $version = $this->resolver()->version($this->record('doc', 1));

        $this->assertSame(['1', 3], [$version->id, $version->lineCount]);
    }

    public function test_sections_come_a_page_at_a_time_with_duplicate_headings_kept_apart(): void
    {
        $this->createDocument(<<<'TEXT'
            # Notes
            One.
            # Notes
            Two.
            # End
            Three.

            TEXT);

        $first = $this->resolver()->sections($this->record('doc', 1), '1', 0, PageSize::from(2));
        $rest = $this->resolver()->sections(
            $this->record('doc', 1),
            '1',
            (int) $first->nextAfterSection,
            PageSize::from(2),
        );

        $this->assertSame(
            [['Notes', 1], ['Notes', 3]],
            array_map(fn ($section) => [$section->heading, $section->firstLine], $first->items),
        );
        $this->assertSame(['End'], array_map(fn ($section) => $section->heading, $rest->items));
        $this->assertNull($rest->nextAfterSection);
    }

    public function test_a_long_read_is_cut_and_reads_on_from_its_next_line_at_the_same_version(): void
    {
        $this->createDocument(
            "# Long\n".implode("\n", array_map(fn (int $line) => "Line {$line}.", range(1, 300)))."\n",
        );

        $first = $this->resolver()->read($this->record('doc', 1), '1', new TextSelection(firstLine: 1));
        $next = $this->resolver()->read(
            $this->record('doc', 1),
            '1',
            new TextSelection(firstLine: (int) $first->nextLine),
        );

        $this->assertSame([1, 200, 201], [$first->firstLine, $first->lastLine, $first->nextLine]);
        $this->assertSame(201, $next->firstLine);
        $this->assertNull($next->nextLine);
    }

    public function test_a_line_longer_than_a_part_is_refused_by_name(): void
    {
        $this->createDocument("# Wide\n".str_repeat('x', 17_000)."\n");

        $this->expectException(TextLineTooLong::class);

        $this->resolver()->read($this->record('doc', 1), '1', new TextSelection(firstLine: 2));
    }

    public function test_the_whole_text_at_once_is_refused(): void
    {
        $this->createDocument(<<<'TEXT'
            # Goal
            Ship it.

            TEXT);

        $this->expectException(TextSelectionRefused::class);

        $this->resolver()->read($this->record('doc', 1), '1', new TextSelection(all: true));
    }

    public function test_a_report_has_only_version_one(): void
    {
        $this->app->make(CommandBus::class)->run(new CreateReport('Check', 'What was found', <<<'TEXT'
            # Found
            All fine.

            TEXT));

        $this->expectException(TextVersionUnavailable::class);

        $this->resolver()->version($this->record('report', 1), '2');
    }

    private function createDocument(string $body): void
    {
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', $body));
    }

    private function record(string $type, int $number): RecordIdentity
    {
        return $this->app->make(RecordResolver::class)->identify(RecordReference::of($type, $number));
    }

    private function resolver(): TextResolver
    {
        return $this->app->make(TextResolver::class);
    }
}
