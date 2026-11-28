<?php

declare(strict_types=1);

namespace App\Providers;

use App\CommandRules\Enums\SyntaxForm;
use App\Concerns\LoadsCoreRoutes;
use App\Processes\Contracts\StopPreparer;
use App\Processes\Readers\ProfileLanguage;
use App\Scripts\Contracts\ScriptChecks as ScriptChecksContract;
use App\Scripts\Contracts\ScriptCompilation as ScriptCompilationContract;
use App\Scripts\Contracts\ScriptKeywordRegistration as ScriptKeywordRegistrationContract;
use App\Scripts\Contracts\ScriptObjectRegistration as ScriptObjectRegistrationContract;
use App\Scripts\ScriptChecks;
use App\Scripts\ScriptCompilation;
use App\Scripts\ScriptKeywordRegistration;
use App\Scripts\ScriptObjectRegistration;
use App\Scripts\ScriptStopPreparation;
use App\Sessions\Contracts\ProfileLanguage as ProfileLanguageContract;
use App\Support\Keywords\CheckKeyword;
use App\Support\Keywords\ConditionalKeyword;
use App\Support\Keywords\RunKeyword;
use App\Support\Keywords\ScriptTrigger;
use App\Support\Keywords\YieldKeyword;
use App\Support\Objects\WorkspaceScriptObject;
use App\Values\ScriptKeywordDefinition;
use Illuminate\Support\ServiceProvider;

final class ScriptsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->singleton(ScriptObjectRegistration::class);
        $this->app->singleton(ScriptKeywordRegistration::class);
        $this->app->alias(ScriptObjectRegistration::class, ScriptObjectRegistrationContract::class);
        $this->app->alias(ScriptKeywordRegistration::class, ScriptKeywordRegistrationContract::class);
        // The implementation belongs to a higher area; a Bind attribute here would create a reverse dependency.
        $this->app->bind(ScriptCompilationContract::class, ScriptCompilation::class);
        $this->app->bind(ScriptChecksContract::class, ScriptChecks::class);
        $this->app->bind(StopPreparer::class, ScriptStopPreparation::class);
        $this->app->bind(ProfileLanguageContract::class, ProfileLanguage::class);
    }

    public function boot(ScriptObjectRegistration $objects, ScriptKeywordRegistration $keywords): void
    {
        $this->loadCoreRoutes('scripts/agent.php');
        $this->loadCoreRoutes('scripts/web.php');

        $objects->register(WorkspaceScriptObject::class);
        $keywords->register(ScriptKeywordDefinition::structure('ON', SyntaxForm::Handler, 'Open a trigger handler.'));

        $keywords->register(
            ScriptKeywordDefinition::structure('ELSE', SyntaxForm::ElseBlock, 'Open the other branch.'),
        );

        $keywords->register(ScriptKeywordDefinition::structure('END', SyntaxForm::EndBlock, 'Close the block.'));
        $keywords->register(ScriptKeywordDefinition::trigger('STOP', ScriptTrigger::class));
        $keywords->register(ScriptKeywordDefinition::negation());
        $keywords->register(RunKeyword::definition());
        $keywords->register(CheckKeyword::definition());
        $keywords->register(ConditionalKeyword::definition());
        $keywords->register(YieldKeyword::definition());
    }
}
