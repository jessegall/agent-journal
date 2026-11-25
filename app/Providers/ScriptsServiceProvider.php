<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Processes\StopPreparer;
use App\Contracts\Scripts\ScriptChecks as ScriptChecksContract;
use App\Contracts\Scripts\ScriptCompilation as ScriptCompilationContract;
use App\Contracts\Scripts\ScriptKeywordRegistration as ScriptKeywordRegistrationContract;
use App\Contracts\Scripts\ScriptObjectRegistration as ScriptObjectRegistrationContract;
use App\Contracts\Sessions\ProfileLanguage as ProfileLanguageContract;
use App\Enums\CommandRules\SyntaxForm;
use App\Support\Keywords\CheckKeyword;
use App\Support\Keywords\ConditionalKeyword;
use App\Support\Keywords\RunKeyword;
use App\Support\Keywords\ScriptTrigger;
use App\Support\Keywords\YieldKeyword;
use App\Support\Objects\WorkspaceObject;
use App\Support\Readers\ProfileLanguage;
use App\Support\ScriptChecks;
use App\Support\ScriptCompilation;
use App\Support\ScriptKeywordRegistration;
use App\Support\ScriptObjectRegistration;
use App\Support\ScriptStopPreparation;
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

        $objects->register(WorkspaceObject::class);
        $keywords->register(ScriptKeywordDefinition::structure('ON', SyntaxForm::Handler, 'Open a trigger handler.'));
        $keywords->register(ScriptKeywordDefinition::structure('ELSE', SyntaxForm::ElseBlock, 'Open the other branch.'));
        $keywords->register(ScriptKeywordDefinition::structure('END', SyntaxForm::EndBlock, 'Close the block.'));
        $keywords->register(ScriptKeywordDefinition::trigger('STOP', ScriptTrigger::class));
        $keywords->register(ScriptKeywordDefinition::negation());
        $keywords->register(RunKeyword::definition());
        $keywords->register(CheckKeyword::definition());
        $keywords->register(ConditionalKeyword::definition());
        $keywords->register(YieldKeyword::definition());
    }
}
