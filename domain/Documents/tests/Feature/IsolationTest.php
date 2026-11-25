<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\ContentMissing;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\ReflectedType;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Enums\EditingStatus;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Two actors served one after the other by one long-running worker see nothing of each other; no command lets a
 * caller name an author; a failed create leaves nothing behind and announces nothing.
 */
final class IsolationTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'document_closes',
        'document_drafts',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    public function test_a_second_request_in_the_same_worker_sees_no_draft_text_of_the_first(): void
    {
        $this->actAsUser(1);
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Private draft text\n"));
        $this->bus()->run(new OpenDocumentCommand('1'));
        $this->assertSame(EditingStatus::HeldByViewer, $this->app->make(DraftResolver::class)->stateOf(1)->state);

        $this->app->forgetScopedInstances();
        $this->actAsUser(2);

        $state = $this->app->make(DraftResolver::class)->stateOf(1);
        $this->assertSame(EditingStatus::Held, $state->state);
        $this->assertNotSame(TestIds::of(2), Document::query()->sole()->creator_id);
    }

    public function test_no_create_command_takes_an_author(): void
    {
        foreach ([CreateDocumentCommand::class] as $command) {
            $parameters = array_map(
                fn (ReflectedParameter $parameter) => $parameter->name(),
                ReflectedType::of($command)->constructor()
                    ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
                    ->getOrElse([]),
            );

            $this->assertSame(
                [],
                array_values(
                    array_filter($parameters, fn (string $name) => preg_match('/author|creator|actor/i', $name) === 1),
                ),
            );
        }

        $this->actAsUser(3);
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $this->assertSame(TestIds::of(3), DocumentRevision::query()->sole()->author_id);
    }

    public function test_a_failed_create_leaves_no_record_and_raises_no_event(): void
    {
        $this->actAsUser(1);
        $announced = [];

        $this->app->make(Dispatcher::class)->listen(DocumentCreated::class, function (
            DocumentCreated $event,
        ) use (&$announced): void {
            $announced[] = $event->number;
        });

        try {
            $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "   \n"));
            $this->fail('An empty body was accepted.');
        } catch (ContentMissing) {
            $this->assertSame([
                0,
                0,
                [],
            ], [
                Document::query()->count(),
                DocumentRevision::query()->count(),
                $announced,
            ]);
        }
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
