<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Enums\ExecutionModeType;
use App\Sessions\Values\ExecutionPolicy;
use App\Values\ExecutionBudgets;
use App\Values\ModelSelection;
use App\Values\PinnedDriver;
use App\Values\SelectedDriver;
use App\Values\StartRequest;
use Illuminate\Container\Container;
use Illuminate\Support\Str;

/**
 * The program and model a test start names, and a fresh start request id for it.
 */
final class TestSelections
{
    public const string MODEL = 'claude-opus-5-5';

    public static function of(string $driver = 'claude-code'): SelectedDriver
    {
        return SelectedDriver::resolve($driver, ModelSelection::named(self::MODEL), null, null, app(DriverCatalogue::class));
    }

    public static function requestId(): string
    {
        return strtolower((string) Str::ulid());
    }

    /**
     * The driver pin a start record of the request keeps, as the journal's catalogue gives it.
     */
    public static function pinOf(StartRequest $request): PinnedDriver
    {
        return Container::getInstance()->make(DriverCatalogue::class)
            ->pinned($request->selection->driver, $request->driverType, $request->neededCapabilities());
    }

    /**
     * The selection columns of a session row a test writes by hand.
     *
     * @return array<string, string|int>
     */
    public static function sessionColumns(string $driver = DefaultDrivers::CLAUDE_CODE): array
    {
        return [
            'driver_key' => $driver,
            'model' => self::MODEL,
            'requested_model_type' => 'named',
            'requested_model' => self::MODEL,
            'driver_source' => 'explicit',
            'profile_key' => 'main-agent',
            'profile_revision' => 1,
            'start_request_id' => self::requestId(),
        ];
    }

    /**
     * A start on the protected host, as a main agent runs.
     */
    public static function onHost(): ExecutionPolicy
    {
        return new ExecutionPolicy(
            ExecutionModeType::ProtectedHost,
            null,
            '/workspaces/test',
            ExecutionBudgets::defaults(),
            [],
        );
    }
}
