<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\ProfileLanguage;
use App\Contracts\ScriptChecks;
use App\Contracts\ScriptCompilation;
use App\Contracts\ScriptKeywordRegistration;
use App\Contracts\ScriptObjectRegistration;
use App\Contracts\StopPreparer;
use App\Enums\SyntaxForm;
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
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/scripts/agent.php');
        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/scripts/web.php');

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
