<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Contracts\Domain;
use App\Domain\Rules\Api\Events\RuleApproved;
use App\Domain\Rules\Api\Events\RuleDenied;
use App\Domain\Rules\Api\Events\RuleRemoved;
use App\Domain\Rules\Api\RuleFilters;
use App\Domain\Rules\Api\RuleList;
use App\Domain\Rules\Api\RuleView;
use App\Domain\Rules\Contracts\RuleReader;
use App\Domain\Rules\Contracts\RuleReviewer;
use App\Domain\Rules\Enums\RuleState;
use App\Domain\Rules\Exceptions\RuleMissing;
use App\Domain\Rules\Exceptions\RuleNotProposed;

final class RulesDomain implements Domain
{
    public function description(): string
    {
        return 'The standing project rules every agent is told.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [
            RuleApproved::class,
            RuleDenied::class,
            RuleRemoved::class,
            RuleReader::class,
            RuleReviewer::class,
            RuleFilters::class,
            RuleList::class,
            RuleView::class,
            RuleState::class,
            RuleMissing::class,
            RuleNotProposed::class,
        ];
    }
}
