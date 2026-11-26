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
 * An agent comments on a whole record.
 */
#[TestsRoute('POST', 'comments.agent.post')]
final class AgentPostPostTest extends GuardedRouteEntryTestCase
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
        $submissionKey = (string) Str::uuid();

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'target' => $reference,
                'body' => 'Is this still open?',
                'submission_key' => $submissionKey,
                'request_key' => 'comments-1',
            ])
            ->reply(PostCommentCommand::class, Str::ulid())
            ->expects(PostCommentCommand::class, [
                'target' => $target,
                'body' => 'Is this still open?',
                'submissionKey' => $submissionKey,
            ]);
    }
}
