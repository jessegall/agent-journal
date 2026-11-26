<?php

declare(strict_types=1);

namespace App\Pages;

use App\Accounts\AccountOwnerCheck;
use App\CommandRules\Enums\SyntaxForm;
use App\Declarations\ActionRoute;
use App\Declarations\Page;
use App\Http\Controllers\Pages\CheckDraftPageController;
use App\Http\Controllers\Pages\SaveDraftPageController;
use App\Http\Pages\Resolvers\ProfileScriptWindowResolver;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Enums\Icon;
use App\Profiles\Data\Flows\FlowEdgeData;
use App\Profiles\Data\Flows\FlowGraphData;
use App\Profiles\Data\Flows\FlowNodeData;
use App\Profiles\Data\ProfileDraftData;
use App\Profiles\Data\ProfileLanguageData;
use App\Profiles\Data\ProfileRunData;
use App\Profiles\Data\ProfileScriptPageData;
use App\Profiles\Data\ProfileStepData;
use App\Profiles\Data\ScriptKeywordData;
use App\Profiles\Data\ScriptObjectData;
use App\Profiles\Enums\DiagnosticCode;
use App\Profiles\Enums\FlowNodeType;
use App\Profiles\Enums\KeywordCategory;
use App\Profiles\Enums\ProfileRunStatus;
use App\Profiles\Enums\ScriptEffect;
use App\Records\Contracts\TypeProvider;
use App\Terminals\Enums\StepStatus;

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
    public function declarations(): DomainClient
    {
        return DomainClient::ofCore($this, 'Scripts', 'scripts');
    }
}
