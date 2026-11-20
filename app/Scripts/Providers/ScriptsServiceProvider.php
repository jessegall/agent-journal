<?php

declare(strict_types=1);

namespace App\Scripts\Providers;

use App\Profiles\Contracts\ScriptCompilation;
use App\Scripts\Enums\SyntaxForm;
use App\Scripts\Keywords\CheckKeyword;
use App\Scripts\Keywords\IfKeyword;
use App\Scripts\Keywords\RunKeyword;
use App\Scripts\Keywords\StopTrigger;
use App\Scripts\Keywords\YieldKeyword;
use App\Scripts\Objects\WorkspaceObject;
use App\Scripts\Support\KeywordRegistry;
use App\Scripts\Support\ObjectRegistry;
use App\Scripts\Support\ProfileScriptCompiler;
use App\Scripts\Values\KeywordDefinition;
use Illuminate\Support\ServiceProvider;

final class ScriptsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ObjectRegistry::class);
        $this->app->singleton(KeywordRegistry::class);
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(ScriptCompilation::class, ProfileScriptCompiler::class);
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
        $keywords->register(IfKeyword::definition());
        $keywords->register(YieldKeyword::definition());
    }
}
