<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Routes;

use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\CommentsDomain;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * An agent finds where a comment on a record stands.
 */
#[TestsRoute('POST', 'comments.agent.location')]
final class AgentLocationPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $reference = "doc {$document->number}";
        $target = $journal->service(RecordResolver::class)->identify(RecordReference::parse($reference));
        $commentId = $journal->runAs('Writer', new PostCommentCommand($target, 'Is this still open?', (string) Str::uuid()));

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['target' => $reference, 'comment' => $commentId]);
    }
}
