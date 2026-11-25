<?php

declare(strict_types=1);

namespace App\Pages;

use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\TypeProvider;
use App\Data\Flows\FlowEdgeData;
use App\Data\Flows\FlowGraphData;
use App\Data\Flows\FlowNodeData;
use App\Data\Profiles\ProfileDraftData;
use App\Data\Profiles\ProfileLanguageData;
use App\Data\Profiles\ProfileRunData;
use App\Data\Profiles\ProfileScriptPageData;
use App\Data\Profiles\ProfileStepData;
use App\Data\Profiles\ScriptKeywordData;
use App\Data\Profiles\ScriptObjectData;
use App\Declarations\ActionRoute;
use App\Declarations\DomainUi;
use App\Declarations\Page;
use App\Enums\CommandRules\SyntaxForm;
use App\Enums\Navigation\Icon;
use App\Enums\Profiles\DiagnosticCode;
use App\Enums\Profiles\FlowNodeType;
use App\Enums\Profiles\KeywordCategory;
use App\Enums\Profiles\ProfileRunStatus;
use App\Enums\Profiles\ScriptEffect;
use App\Enums\Terminals\StepStatus;
use App\Http\Controllers\Pages\CheckDraftPageController;
use App\Http\Controllers\Pages\SaveDraftPageController;
use App\Http\Pages\Resolvers\ProfileScriptWindowResolver;
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
            ProfileRunStatus::class,
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
        return DomainUi::ofCore($this, 'Scripts', 'scripts');
    }
}
