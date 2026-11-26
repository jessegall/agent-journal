<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\DefaultDrivers;
use App\Contracts\Drivers\DriverKeyScripts;
use App\Contracts\Drivers\PinnedBuilds;
use App\Enums\Navigation\NavigationKey;
use App\Support\KeyScripts\KeyScript;
use App\Support\KeyScripts\KeyStep;
use App\Support\KeyScripts\ScreenExpectation;

/**
 * The key scripts recorded for Codex: each goes through the /model picker and ends on Codex's own line saying the
 * model changed (recordings codex/0.165.0/keyscripts/model-choice and effort-change).
 */
final readonly class CodexKeyScripts implements DriverKeyScripts
{
    public function __construct(private PinnedBuilds $builds) {}

    /**
     * Codex's key scripts for its pinned build.
     *
     * @return list<KeyScript>
     */
    public function __invoke(): array
    {
        $enterIn = fn (string $name, string $family) => KeyStep::press(
            $name,
            ScreenExpectation::menu($family),
            NavigationKey::Enter->bytes(),
        );

        $openModelPicker = KeyScript::command('/model', '› /model');

        $changeModel = [
            ...$openModelPicker,
            KeyStep::find('find the model', 'model-picker', 'model'),
            $enterIn('choose the model', 'model-picker'),
            KeyStep::findMarked('find the default reasoning', 'reasoning-picker', '(default)'),
            $enterIn('keep the default reasoning', 'reasoning-picker'),
            KeyStep::evidence('see the model applied', 'model changed to {model}'),
        ];

        $changeEffort = [
            ...$openModelPicker,
            KeyStep::findMarked('find the current model', 'model-picker', '(current)'),
            $enterIn('keep the current model', 'model-picker'),
            KeyStep::find('find the reasoning level', 'reasoning-picker', 'effort'),
            $enterIn('choose the reasoning level', 'reasoning-picker'),
            KeyStep::evidence('see the reasoning applied', 'model changed to', ' {effort}'),
        ];

        $driver = DefaultDrivers::CODEX;

        return [
            new KeyScript('ChangeModel', $driver, $this->builds->versionOf(DefaultDrivers::CODEX), ['model'], $changeModel),
            new KeyScript('ChangeEffort', $driver, $this->builds->versionOf(DefaultDrivers::CODEX), ['effort'], $changeEffort),
        ];
    }
}
