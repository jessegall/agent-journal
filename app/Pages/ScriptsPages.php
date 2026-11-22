<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\PageProvider;
use App\Contracts\TypeProvider;
use App\Data\FlowEdgeData;
use App\Data\FlowGraphData;
use App\Data\FlowNodeData;
use App\Data\ProfileDraftData;
use App\Data\ProfileLanguageData;
use App\Data\ProfileRunData;
use App\Data\ProfileScriptPageData;
use App\Data\ProfileStepData;
use App\Data\ScriptKeywordData;
use App\Data\ScriptObjectData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\Page;
use App\Enums\DiagnosticCode;
use App\Enums\FlowNodeType;
use App\Enums\Icon;
use App\Enums\KeywordCategory;
use App\Enums\ProfileRunState;
use App\Enums\ScriptEffect;
use App\Enums\StepStatus;
use App\Enums\SyntaxForm;
use App\Http\Controllers\Pages\CheckDraftPageController;
use App\Http\Controllers\Pages\SaveDraftPageController;
use App\Resolvers\ProfileScriptWindowResolver;
use App\Support\AccountOwnerCheck;

/**
 * The pages Core's Scripts declares, for the owner alone, under /scripts: the script editor of one profile.
 */
final class ScriptsPages implements PageProvider, TypeProvider
{
    public function pages(): array
    {
        return [
            Page::make(
                'profile-script',
                'Profile script',
                Icon::Accounts,
                ProfileScriptWindowResolver::class,
                'ProfileScriptWindow.vue',
            )
                ->at('{profile}')
                ->visibleWhen(AccountOwnerCheck::class)
                ->actions(
                    ActionRoute::post('{profile}/draft/check', CheckDraftPageController::class, 'check-draft'),
                    ActionRoute::post('{profile}/draft/save', SaveDraftPageController::class, 'save-draft'),
                ),
        ];
    }

    /**
     * The data classes and enums these pages own, generated in the scripts module.
     */
    public function types(): array
    {
        return [
            FlowEdgeData::class,
            FlowGraphData::class,
            FlowNodeData::class,
            ProfileDraftData::class,
            ProfileLanguageData::class,
            ProfileRunData::class,
            ProfileScriptPageData::class,
            ProfileStepData::class,
            ScriptKeywordData::class,
            ScriptObjectData::class,
            DiagnosticCode::class,
            FlowNodeType::class,
            KeywordCategory::class,
            ProfileRunState::class,
            ScriptEffect::class,
            StepStatus::class,
            SyntaxForm::class,
        ];
    }

    /**
     * The script pages under their own key, scripts, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Scripts', 'App\\Scripts', dirname(__DIR__, 2).'/resources/js/scripts');
    }
}
