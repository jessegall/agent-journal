<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Questions\Commands\AnswerQuestion\AnswerQuestionCommand;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner answers an agent's question in their chat.
 */
#[TestsRoute('POST', 'chat.answer')]
final class AnswerPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->signedStart('Planner');
        $chats = $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner');
        $question = $journal->fixtures(QuestionFixtures::class)->createQuestion(
            'Database',
            $chats->pairChatOf('Owner', 'Planner'),
            'Planner',
            'Owner',
        );
        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->payload([
                'questionId' => $question->id,
                'answer' => 'Postgres',
            ])
            ->expects(AnswerQuestionCommand::class, [
                'questionId' => $question->id,
                'answer' => 'Postgres',
            ]);
    }
}
