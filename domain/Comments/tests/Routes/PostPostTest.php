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
 * The owner comments on a whole record.
 */
#[TestsRoute('POST', 'comments.post')]
final class PostPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, DocumentsDomain::class);
    }

    public function test_a_mixed_or_partial_place_or_an_author_field_is_refused_and_nothing_is_sent(): void
    {
        $this->journal->owner();
        $document = $this->journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $this->journal->sinkCommands();

        foreach ([
            [
                'version' => '1',
                'section' => 3,
                'quote' => 'x',
                'first_line' => 1,
                'last_line' => 1,
                'start_offset' => 0,
                'end_offset' => 1,
            ],
            [
                'first_line' => 12,
                'last_line' => 16,
            ],
            [
                'author_id' => 'someone',
            ],
        ] as $place) {
            $this->journal->jsonRoute('POST', 'comments.post', payload: [
                'target' => "doc {$document->number}",
                'body' => 'Here.',
                'submission_key' => (string) Str::uuid(),
                ...$place,
            ])->assertUnprocessable();
        }

        $this->journal->assertDispatchedExactly([]);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $document = $journal->run(new CreateDocumentCommand('Design', 'The plan.', "# Design\nText.", TestProjects::local()->id));
        $reference = "doc {$document->number}";
        $target = $journal->service(RecordResolver::class)->identify(RecordReference::parse($reference));
        $submissionKey = (string) Str::uuid();

        return RouteCall::as(Caller::User)
            ->payload(['target' => $reference, 'body' => 'Is this still open?', 'submission_key' => $submissionKey])
            ->reply(PostCommentCommand::class, Str::ulid())
            ->expects(PostCommentCommand::class, [
                'target' => $target,
                'body' => 'Is this still open?',
                'submissionKey' => $submissionKey,
            ]);
    }
}
