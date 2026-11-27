<?php

declare(strict_types=1);

namespace Domain\Questions;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\Codebase;
use App\Support\Domain;
use App\Support\Exports;
use Domain\Questions\Commands\AnswerQuestion\AnswerQuestionCommand;
use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Events\QuestionAsked;
use Domain\Questions\Support\ShownQuestion;
use Domain\Questions\Values\QuestionNotificationKeys;
use Domain\Questions\Values\QuestionSummary;

final class QuestionsDomain extends Domain implements CommandProvider, McpToolProvider
{
    public function description(): string
    {
        return 'Questions an actor asks another in an inbox, open or with options, and their answers.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->commands(AnswerQuestionCommand::class)
            ->events(QuestionAsked::class, QuestionAnswered::class)
            ->contracts(QuestionSummaryReader::class)
            ->values(QuestionNotificationKeys::class, QuestionSummary::class, ShownQuestion::class)
            ->build();
    }

    public function commands(): array
    {
        return Codebase::in(__DIR__.'/Commands/*', Command::class);
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }
}
