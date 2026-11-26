<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\StartConditions\AccountStart;
use App\Agents\Drivers\StartConditions\AccountTerminal;
use App\Agents\Drivers\StartConditions\AccountWithoutFolder;
use App\Agents\Drivers\StartConditions\CliTransportAccount;
use App\Agents\Drivers\StartConditions\JournalServerAccount;
use App\Agents\Drivers\StartConditions\ProtectedAccount;
use App\Agents\Drivers\StartConditions\ResumedStart;
use App\Agents\Drivers\StartConditions\ResumedTerminal;
use App\Agents\Drivers\StartConditions\ResumedTurn;
use App\Agents\Drivers\StartConditions\SeatbeltedTurn;
use App\Agents\Drivers\StartConditions\TurnStart;
use App\Contracts\CommandLines\Condition;
use App\Enums\Hosts\HostProcessType;
use App\Enums\Sessions\TransportProfileType;
use App\Support\AccountStartRecipe;
use App\Values\DriverAccount;
use App\Values\DriverStart;
use Tests\TestCase;

/**
 * Each start condition holds for exactly the starts it names, over one table of starts.
 */
final class StartConditionsTest extends TestCase
{
    public function test_each_condition_holds_for_the_starts_it_names(): void
    {
        $starts = [
            'terminal' => $this->start(HostProcessType::Terminal),
            'resumed turn' => $this->start(HostProcessType::Pipe, isResume: true),
            'resumed terminal on a CLI account' => $this->start(
                HostProcessType::Terminal,
                true,
                $this->account(TransportProfileType::Cli),
            ),
            'turn on a seatbelted account' => $this->start(
                HostProcessType::Pipe,
                account: $this->account(TransportProfileType::Mcp, '/accounts/a'),
            ),
            'terminal on a protected account' => $this->start(
                HostProcessType::Terminal,
                account: $this->account(TransportProfileType::Mcp, '/accounts/a', isProtected: true),
            ),
        ];
        $conditions = [
            TurnStart::class => ['resumed turn', 'turn on a seatbelted account'],
            ResumedStart::class => ['resumed turn', 'resumed terminal on a CLI account'],
            ResumedTerminal::class => ['resumed terminal on a CLI account'],
            ResumedTurn::class => ['resumed turn'],
            AccountStart::class => [
                'resumed terminal on a CLI account',
                'turn on a seatbelted account',
                'terminal on a protected account',
            ],
            AccountTerminal::class => ['resumed terminal on a CLI account', 'terminal on a protected account'],
            AccountWithoutFolder::class => ['resumed terminal on a CLI account'],
            ProtectedAccount::class => ['terminal on a protected account'],
            JournalServerAccount::class => ['turn on a seatbelted account', 'terminal on a protected account'],
            CliTransportAccount::class => ['resumed terminal on a CLI account'],
            SeatbeltedTurn::class => ['turn on a seatbelted account'],
        ];

        $this->journal->assertResult($conditions, array_map(
            fn (string $condition) => $this->holdingFor(new $condition(), $starts),
            array_combine(array_keys($conditions), array_keys($conditions)),
        ));
    }

    /**
     * @param  Condition<DriverStart>  $condition
     * @param  array<string, DriverStart>  $starts
     * @return list<string>
     */
    private function holdingFor(Condition $condition, array $starts): array
    {
        return array_keys(array_filter($starts, fn (DriverStart $start) => $condition->holdsFor($start)));
    }

    private function start(HostProcessType $type, bool $isResume = false, DriverAccount|null $account = null): DriverStart
    {
        return new DriverStart('session-1', $type, '/work', isResume: $isResume, account: $account);
    }

    private function account(
        TransportProfileType $transport,
        string|null $folder = null,
        bool $isProtected = false,
    ): DriverAccount {
        $recipe = new AccountStartRecipe(
            environment: [],
            emptyFolderVariables: [],
            removedVariables: [],
            startFlags: [],
            accountSettings: [],
            driverVersion: '2.1.323',
            binaryDigest: '',
            arrangement: 'local',
            protectionSettings: '',
            transportProfile: $transport,
            readFiles: [],
        );

        return new DriverAccount($recipe, 'start-1', isProtected: $isProtected, folder: $folder);
    }
}
