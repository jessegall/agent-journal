<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Bus\CommandMiddleware\AuthorizeCommand;
use App\Bus\CommandScope;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandAdmissionRefused;
use App\Bus\MiddlewareDeclaration;
use App\Bus\RequestKey;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use App\CommandRules\Exceptions\RefusalReplayed;
use App\Engine\Enums\CommandAdmissionStage;
use App\Engine\Enums\RefusalCode;
use App\Models\CommandRules\CommandReceipt;
use Domain\Rules\RulesDomain;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A command is admitted twice: before its middleware on the command as sent, and once more right before its handler on
 * the command its inside middleware made, so a refusal there rolls back the whole transaction, a nested command's
 * included, and a keyed retry gets the same refusal.
 */
#[TestsMiddleware(AuthorizeCommand::class)]
final class AuthorizeCommandTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * The tables these tests commit to, emptied around each test.
     */
    private const array TABLES = [];

    private const string KEY = 'effective-command-policy';

    /**
     * The domains these tests use beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    public function test_inside_middleware_replacement_is_checked_before_handler_and_refusal_replays(): void
    {
        $this->prepareCommandPolicy();
        $this->installCommandModules(
            MiddlewareDeclaration::inside(UppercasesText::class, CommandScope::command(WriteNoteCommand::class)),
        );
        $this->journal->actAsUserId(TestIds::of(1));
        $this->app->make(RequestKey::class)->set(self::KEY);
        $admission = $this->mock(CommandAdmission::class);
        $admission->shouldReceive('assess')->twice()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeMiddleware
                && $call->command instanceof WriteNoteCommand && $call->command->text === 'outside',
        )->andReturn(CommandDecision::allow());
        $admission->shouldReceive('assess')->once()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeHandler
                && $call->command instanceof WriteNoteCommand && $call->command->text === 'OUTSIDE',
        )->andReturn(CommandDecision::refuse(RefusalCode::Forbidden, 'The effective record is outside the grant.'));
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new WriteNoteCommand('outside')), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new WriteNoteCommand('outside')), RefusalReplayed::class);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_nested_command_gets_final_admission_and_rolls_back_the_outer_transaction(): void
    {
        $this->prepareCommandPolicy();
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        $admission = $this->mock(CommandAdmission::class);
        $admission->shouldReceive('assess')->twice()->withArgs(
            fn (EffectiveCommand $call): bool => $call->command instanceof CopyNoteCommand,
        )->andReturn(CommandDecision::allow());
        $admission->shouldReceive('assess')->once()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeHandler
                && $call->command instanceof WriteNoteCommand,
        )->andReturn(CommandDecision::refuse(RefusalCode::Forbidden, 'The nested write is outside the grant.'));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new CopyNoteCommand('nested')),
            CommandAdmissionRefused::class,
        );

        $database = $this->app->make(ConnectionInterface::class);
        $this->assertSame(0, $database->table('module_command_rows')->count());
    }

    /**
     * The setup the CommandPolicy cases share.
     */
    private function prepareCommandPolicy(): void
    {

        $this->beforeApplicationDestroyed(function (): void {
            CommandReceipt::query()->where('request_key', self::KEY)->delete();
        });
    }
}
