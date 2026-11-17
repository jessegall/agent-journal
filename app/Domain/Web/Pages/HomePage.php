<?php

declare(strict_types=1);

namespace App\Domain\Web\Pages;

use App\Domain\Web\Data\ChatData;
use App\Domain\Web\Data\HomeFiltersData;
use App\Domain\Web\Data\LayoutData;
use App\Domain\Web\Data\PlanListData;
use App\Domain\Web\Data\RuleListData;
use App\Domain\Web\Views\ChatView;
use App\Domain\Web\Views\LayoutsView;
use App\Domain\Web\Views\PlansView;
use App\Domain\Web\Views\RulesView;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\FromContainer;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Home: the windows its panes arrange, the chat with a chosen agent session, the same plans and rules slices their own
 * pages show, and the user's saved layouts.
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

    #[Computed]
    public RuleListData $rules {
        get => $this->rulesView->rules($this->filters->rules);
    }

    /**
     * @var list<LayoutData>
     */
    #[Computed, DataCollectionOf(LayoutData::class)]
    public array $layouts {
        get => $this->layoutsView->layouts();
    }

    public function __construct(
        #[Hidden] public readonly HomeFiltersData $filters,
        #[Hidden, FromContainer(ChatView::class)] public readonly ChatView $chatView,
        #[Hidden, FromContainer(PlansView::class)] public readonly PlansView $plansView,
        #[Hidden, FromContainer(RulesView::class)] public readonly RulesView $rulesView,
        #[Hidden, FromContainer(LayoutsView::class)] public readonly LayoutsView $layoutsView,
    ) {}

    public static function for(HomeFiltersData $filters): self
    {
        return self::from(['filters' => $filters]);
    }
}
