<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Text\Exceptions\ContentMissing;
use Domain\Documents\Api\Events\DocumentCreated;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Contracts\DraftResolver;
use Domain\Documents\Enums\EditingState;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use ReflectionClass;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Two actors served one after the other by one long-running worker see nothing of each other; no command lets a
 * caller name an author; a failed create leaves nothing behind and announces nothing.
 */
final class IsolationTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['document_closes', 'document_drafts', 'document_revisions', 'documents', 'number_groups'];

    public function test_a_second_request_in_the_same_worker_sees_no_draft_text_of_the_first(): void
    {
        $this->actAsUser(1);
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Private draft text\n"));
        $this->bus()->run(new OpenDocument(1));
        $this->assertSame(EditingState::Yours, $this->app->make(DraftResolver::class)->stateOf(1)->state);

        $this->app->forgetScopedInstances();
        $this->actAsUser(2);

        $state = $this->app->make(DraftResolver::class)->stateOf(1);
        $this->assertSame(EditingState::Held, $state->state);
        $this->assertNotSame(TestIds::of(2), Document::query()->sole()->creator_id);
    }

    public function test_no_create_command_takes_an_author(): void
    {
        foreach ([CreateDocument::class] as $command) {
            $parameters = array_map(fn ($parameter) => $parameter->getName(), new ReflectionClass($command)->getConstructor()?->getParameters() ?? []);

            $this->assertSame([], array_values(array_filter($parameters, fn (string $name) => preg_match('/author|creator|actor/i', $name) === 1)));
        }

        $this->actAsUser(3);
        $this->bus()->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $this->assertSame(TestIds::of(3), DocumentRevision::query()->sole()->author_id);
    }

    public function test_a_failed_create_leaves_no_record_and_raises_no_event(): void
    {
        $this->actAsUser(1);
        $announced = [];
        $this->app->make(Dispatcher::class)->listen(DocumentCreated::class, function (DocumentCreated $event) use (&$announced): void {
            $announced[] = $event->number;
        });

        try {
            $this->bus()->run(new CreateDocument('Design', 'What we build', "   \n"));
            $this->fail('An empty body was accepted.');
        } catch (ContentMissing) {
            $this->assertSame([0, 0, []], [Document::query()->count(), DocumentRevision::query()->count(), $announced]);
        }
    }

    private function actAsUser(int $user): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of($user)), new OwnerAuthority('test'));
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
