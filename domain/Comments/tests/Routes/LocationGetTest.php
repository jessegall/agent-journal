<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Routes;

use App\Records\Contracts\RecordResolver;
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
 * The owner reads where a comment stands.
 */
#[TestsRoute('GET', 'comments.location')]
final class LocationGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        $document = $journal->run(
            new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id),
        );

        $reference = "doc {$document->number}";
        $target = $journal->service(RecordResolver::class)->identify(RecordReference::parse($reference));
        $commentId = $journal->run(new PostCommentCommand($target, 'Is this still open?', (string) Str::uuid()));

        return RouteCall::as(Caller::User)->query(['target' => $reference, 'comment' => $commentId]);
    }
}
