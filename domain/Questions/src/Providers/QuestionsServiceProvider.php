<?php

declare(strict_types=1);

namespace Domain\Questions\Providers;

use Domain\Questions\Contracts\QuestionSummaryReader as QuestionSummaryReaderContract;
use Domain\Questions\Support\QuestionSummaryReader;
use Illuminate\Support\ServiceProvider;

final class QuestionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(QuestionSummaryReaderContract::class, QuestionSummaryReader::class);
    }
}
