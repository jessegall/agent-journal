<?php

declare(strict_types=1);

namespace App\Domain\Web\Pages;

use App\Domain\Web\Data\ChatData;
use App\Domain\Web\Data\HomeFiltersData;
use App\Domain\Web\Data\PlanListData;
use App\Domain\Web\Views\ChatView;
use App\Domain\Web\Views\PlansView;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\FromContainer;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Home: the chat with a chosen agent session beside the same plans slice the plans page shows.
 */
#[TypeScript]
final class HomePage extends Data
{
    public const string COMPONENT = 'Home';

    #[Computed]
    public ChatData $chat {
        get => $this->chatView->chat($this->filters);
    }

    #[Computed]
    public PlanListData $plans {
        get => $this->plansView->plans($this->filters->plans);
    }

    public function __construct(
        #[Hidden] public readonly HomeFiltersData $filters,
        #[Hidden, FromContainer(ChatView::class)] public readonly ChatView $chatView,
        #[Hidden, FromContainer(PlansView::class)] public readonly PlansView $plansView,
    ) {}

    public static function for(HomeFiltersData $filters): self
    {
        return self::from(['filters' => $filters]);
    }
}
