<?php

declare(strict_types=1);

namespace Domain\Questions\Providers;

use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Support\QuestionSummaries;
use Illuminate\Support\ServiceProvider;

final class QuestionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(QuestionSummaryReader::class, QuestionSummaries::class);
    }
}
