<?php

declare(strict_types=1);

namespace App\Scripts\Providers;

use App\Profiles\Contracts\ScriptCompilation;
use App\Scripts\Contracts\ScriptChecks;
use App\Scripts\Contracts\ScriptKeywordRegistration;
use App\Scripts\Contracts\ScriptObjectRegistration;
use App\Scripts\Enums\SyntaxForm;
use App\Scripts\Keywords\CheckKeyword;
use App\Scripts\Keywords\ConditionalKeyword;
use App\Scripts\Keywords\RunKeyword;
use App\Scripts\Keywords\StopTrigger;
use App\Scripts\Keywords\YieldKeyword;
use App\Scripts\Objects\WorkspaceObject;
use App\Scripts\Support\KeywordRegistry;
use App\Scripts\Support\ObjectRegistry;
use App\Scripts\Support\ProfileScriptCompiler;
use App\Scripts\Support\ScriptChecker;
use App\Scripts\Values\KeywordDefinition;
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
    }

    public function boot(ObjectRegistry $objects, KeywordRegistry $keywords): void
    {
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
