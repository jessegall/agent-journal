<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;
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
 * An agent comments on a document.
 */
#[TestsRoute('POST', 'documents.agent.docs.comment')]
final class AgentDocsCommentPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $document = $journal->runAs('Writer', new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['doc_id' => $document->id, 'body' => 'Section two is unclear.', 'request_key' => 'documents-1'])
            ->reply(CommentOnDocumentCommand::class, Str::ulid())
            ->expects(CommentOnDocumentCommand::class, [
                'documentId' => $document->id,
                'body' => 'Section two is unclear.',
            ]);
    }
}
