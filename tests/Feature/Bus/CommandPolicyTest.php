<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandAdmission;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\CommandAdmissionRefused;
use App\Bus\Exceptions\RefusalReplayed;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Bus\Support\RequestKey;
use App\Bus\Values\CommandDecision;
use App\Bus\Values\EffectiveCommand;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

final class CommandPolicyTest extends CommandBusTestCase
{
    private const string KEY = 'effective-command-policy';

    protected function tearDown(): void
    {
        CommandReceipt::query()->where('request_key', self::KEY)->delete();

        parent::tearDown();
    }

    public function test_inside_middleware_replacement_is_checked_before_handler_and_refusal_replays(): void
    {
        $this->installCommandModules(
            MiddlewareDeclaration::inside(UppercasesText::class, CommandScope::command(WriteNote::class)),
        );
        $this->startTestUserRequest(1);
        $this->app->make(RequestKey::class)->set(self::KEY);
        $admission = $this->mock(CommandAdmission::class);
        $admission->shouldReceive('assess')->twice()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeMiddleware
                && $call->command instanceof WriteNote && $call->command->text === 'outside',
        )->andReturn(CommandDecision::allow());
        $admission->shouldReceive('assess')->once()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeHandler
                && $call->command instanceof WriteNote && $call->command->text === 'OUTSIDE',
        )->andReturn(CommandDecision::refuse(RefusalCode::Forbidden, 'The effective record is outside the grant.'));
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new WriteNote('outside')), CommandAdmissionRefused::class);
        $this->assertThrows(fn () => $bus->run(new WriteNote('outside')), RefusalReplayed::class);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_nested_command_gets_final_admission_and_rolls_back_the_outer_transaction(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $admission = $this->mock(CommandAdmission::class);
        $admission->shouldReceive('assess')->twice()->withArgs(
            fn (EffectiveCommand $call): bool => $call->command instanceof CopyNote,
        )->andReturn(CommandDecision::allow());
        $admission->shouldReceive('assess')->once()->withArgs(
            fn (EffectiveCommand $call): bool => $call->stage === CommandAdmissionStage::BeforeHandler
                && $call->command instanceof WriteNote,
        )->andReturn(CommandDecision::refuse(RefusalCode::Forbidden, 'The nested write is outside the grant.'));

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new CopyNote('nested')),
            CommandAdmissionRefused::class,
        );

        $database = $this->app->make(ConnectionInterface::class);
        $this->assertSame(0, $database->table('module_command_rows')->count());
    }
}
