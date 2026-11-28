<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Accounts\Values\MonthCost;
use App\Models\Accounts\AccountUsageTokens;
use App\Models\Accounts\AccountUsageWindow;
use App\Web\Creation\Exceptions\MissingFields;
use Spatie\LaravelData\Optional;

final class AccountUsageDataFields
{
    /** @var list<AccountUsageWindowData> */
    private array $windows;

    private AccountMonthCostData|Optional $monthCost;

    private AccountThreadTokensData|Optional $latestThread;

    /** @param list<AccountUsageWindowData> $windows */
    public function windows(array $windows): self
    {
        $this->windows = $windows;

        return $this;
    }

    public function monthCost(AccountMonthCostData|Optional $monthCost): self
    {
        $this->monthCost = $monthCost;

        return $this;
    }

    public function latestThread(AccountThreadTokensData|Optional $latestThread): self
    {
        $this->latestThread = $latestThread;

        return $this;
    }

    /** @param list<AccountUsageWindow> $windows */
    public function readings(array $windows, MonthCost|null $cost, AccountUsageTokens|null $thread): self
    {
        return $this->windows(array_map(AccountUsageWindowData::fromWindow(...), $windows))
            ->monthCost(AccountMonthCostData::optionalOrMissing($cost))
            ->latestThread(AccountThreadTokensData::optionalOrMissing($thread));
    }

    public function finish(): AccountUsageData|Optional
    {
        if (! isset($this->windows)) {
            throw MissingFields::forType(AccountUsageData::class, 'windows');
        }

        if (! isset($this->monthCost)) {
            throw MissingFields::forType(AccountUsageData::class, 'monthCost');
        }

        if (! isset($this->latestThread)) {
            throw MissingFields::forType(AccountUsageData::class, 'latestThread');
        }

        if ($this->windows === [] && $this->monthCost instanceof Optional && $this->latestThread instanceof Optional) {
            return Optional::create();
        }

        return new AccountUsageData(
            windows: $this->windows,
            monthCost: $this->monthCost,
            latestThread: $this->latestThread,
        );
    }
}
