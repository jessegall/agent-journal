<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Scripts\ScriptChecks;
use App\Contracts\Scripts\ScriptCompilation;
use App\Contracts\Scripts\ScriptKeywordRegistration;
use App\Contracts\Scripts\ScriptObjectRegistration;
use App\Contracts\Sessions\ProfileLanguage;
use App\Enums\CommandRules\SyntaxForm;
use App\Support\KeywordRegistry;
use App\Support\Keywords\CheckKeyword;
use App\Support\Keywords\ConditionalKeyword;
use App\Support\Keywords\RunKeyword;
use App\Support\Keywords\StopTrigger;
use App\Support\Keywords\YieldKeyword;
use App\Support\ObjectRegistry;
use App\Support\Objects\WorkspaceObject;
use App\Support\ProfileScriptCompiler;
use App\Support\Readers\ProfileLanguageReader;
use App\Support\ScriptChecker;
use App\Support\ScriptStopPreparation;
use App\Values\KeywordDefinition;
use Illuminate\Support\ServiceProvider;

final class ScriptsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(ObjectRegistry::class);
        $this->app->singleton(KeywordRegistry::class);
        $this->app->alias(ObjectRegistry::class, ScriptObjectRegistration::class);
        $this->app->alias(KeywordRegistry::class, ScriptKeywordRegistration::class);
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(ScriptCompilation::class, ProfileScriptCompiler::class);
        $this->app->bind(ScriptChecks::class, ScriptChecker::class);
        $this->app->bind(StopPreparer::class, ScriptStopPreparation::class);
        $this->app->bind(ProfileLanguage::class, ProfileLanguageReader::class);
    }

    public function boot(ObjectRegistry $objects, KeywordRegistry $keywords): void
    {
        $this->loadCoreRoutes('scripts/agent.php');
        $this->loadCoreRoutes('scripts/web.php');

        $objects->register(WorkspaceObject::class);
        $keywords->register(KeywordDefinition::structure('ON', SyntaxForm::Handler, 'Open a trigger handler.'));
        $keywords->register(KeywordDefinition::structure('ELSE', SyntaxForm::ElseBlock, 'Open the other branch.'));
        $keywords->register(KeywordDefinition::structure('END', SyntaxForm::EndBlock, 'Close the block.'));
        $keywords->register(KeywordDefinition::trigger('STOP', StopTrigger::class));
        $keywords->register(KeywordDefinition::negation());
        $keywords->register(RunKeyword::definition());
        $keywords->register(CheckKeyword::definition());
        $keywords->register(ConditionalKeyword::definition());
        $keywords->register(YieldKeyword::definition());
    }
}
