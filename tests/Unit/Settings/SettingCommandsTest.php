<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Commands\Settings\ResetSetting\ResetSettingCommand;
use App\Commands\Settings\ResetSettingGroup\ResetSettingGroupCommand;
use App\Commands\Settings\SetBooleanSetting\SetBooleanSettingCommand;
use App\Commands\Settings\SetDecimalSetting\SetDecimalSettingCommand;
use App\Commands\Settings\SetIntegerChoice\SetIntegerChoiceCommand;
use App\Commands\Settings\SetIntegerSetting\SetIntegerSettingCommand;
use App\Commands\Settings\SetStringChoice\SetStringChoiceCommand;
use App\Commands\Settings\SetStringSetting\SetStringSettingCommand;
use App\Contracts\Settings\SettingCommands as SettingCommandsContract;
use App\Declarations\IntegerSetting;
use App\Exceptions\SettingHandleUnknown;
use App\Exceptions\SettingReferenceInvalid;
use App\Exceptions\SettingValueInvalid;
use App\Support\CatalogueReflectorFactory;
use App\Support\CoreSettings;
use App\Support\DomainRegistry;
use App\Support\SettingCommands;
use App\Values\Decimal;
use App\Values\GroupReference;
use App\Values\SettingReference;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewLevel;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewMode;
use Tests\Fixtures\Domains\Reviews\ReviewsDomain;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\TestCase;

/**
 * The factory addresses each command by the registered owner and key of the declaration it is given, carries native
 * values only, and refuses a foreign enum case or an unregistered declaration before any command exists.
 */
final class SettingCommandsTest extends TestCase
{
    private SettingCommandsContract $commands;

    private ReviewSettings $reviews;

    protected function setUp(): void
    {
        parent::setUp();

        $registry = DomainRegistry::from([ReviewsDomain::class])->settingDeclarations(new CoreSettings());
        $this->commands = new SettingCommands($registry, new CatalogueReflectorFactory());
        $this->reviews = $registry->definition('Reviews');
    }

    public function test_each_command_is_addressed_by_the_registered_owner_and_key(): void
    {
        $reviews = $this->reviews;

        $this->assertEquals(
            new SetStringSettingCommand(new SettingReference('Reviews', 'title'), 'Weekly', 3),
            $this->commands->string($reviews->title, 'Weekly', 3),
        );
        $this->assertEquals(
            new SetBooleanSettingCommand(new SettingReference('Reviews', 'notify_owner'), false, 3),
            $this->commands->boolean($reviews->notifyOwner, false, 3),
        );
        $this->assertEquals(
            new SetIntegerSettingCommand(new SettingReference('Reviews', 'retry_limit'), 4, 0),
            $this->commands->integer($reviews->retryLimit, 4, 0),
        );
        $this->assertEquals(
            new SetDecimalSettingCommand(new SettingReference('Reviews', 'weight'), Decimal::parse('0.75'), 1),
            $this->commands->decimal($reviews->weight, Decimal::parse('0.75'), 1),
        );
        $this->assertEquals(
            new SetStringChoiceCommand(new SettingReference('Reviews', 'summary_style'), 'long', 1),
            $this->commands->stringChoice($reviews->summaryStyle, 'long', 1),
        );
        $this->assertEquals(
            new SetIntegerChoiceCommand(new SettingReference('Reviews', 'priority'), 1, 1),
            $this->commands->integerChoice($reviews->priority, 1, 1),
        );
        $this->assertEquals(
            new SetStringChoiceCommand(new SettingReference('Reviews', 'review_mode'), ReviewMode::Quick->value, 2),
            $this->commands->enumString($reviews->reviewMode, ReviewMode::Quick, 2),
        );
        $this->assertEquals(
            new SetIntegerChoiceCommand(new SettingReference('Reviews', 'review_level'), 2, 2),
            $this->commands->enumInteger($reviews->reviewLevel, ReviewLevel::SecondPass, 2),
        );
        $this->assertEquals(
            new ResetSettingCommand(new SettingReference('Reviews', 'retry_limit'), 5),
            $this->commands->reset($reviews->retryLimit, 5),
        );
        $this->assertEquals(
            new EnableSettingGroupCommand(new GroupReference('Reviews', 'review'), 5),
            $this->commands->enable($reviews->review, 5),
        );
        $this->assertEquals(
            new DisableSettingGroupCommand(new GroupReference('Reviews', 'review'), 5),
            $this->commands->disable($reviews->review, 5),
        );
        $this->assertEquals(
            new ResetSettingGroupCommand(new GroupReference('Reviews', 'review'), 5),
            $this->commands->resetGroup($reviews->review, 5),
        );
    }

    public function test_a_case_of_another_enum_is_refused_before_a_command_exists(): void
    {
        $this->expectException(SettingValueInvalid::class);
        $this->expectExceptionMessage(
            SettingValueInvalid::for('Reviews', 'review_mode', $this->reviews->reviewMode->type())->getMessage(),
        );

        $this->commands->enumString($this->reviews->reviewMode, ReviewLevel::FirstPass, 0);
    }

    public function test_an_int_backed_case_is_refused_by_the_text_factory(): void
    {
        $this->expectException(SettingValueInvalid::class);

        $this->commands->enumString($this->reviews->reviewLevel, ReviewLevel::FirstPass, 0);
    }

    public function test_a_declaration_built_outside_the_registered_definition_is_unknown(): void
    {
        $this->expectException(SettingHandleUnknown::class);

        $this->commands->integer(IntegerSetting::make('retry_limit', 'Retry limit', 3), 4, 0);
    }

    public function test_a_reference_with_a_key_that_is_not_a_local_key_is_refused(): void
    {
        $this->expectException(SettingReferenceInvalid::class);

        new GroupReference('Reviews', 'a.b');
    }

    public function test_a_reference_without_an_owner_is_refused(): void
    {
        $this->expectException(SettingReferenceInvalid::class);

        new SettingReference(' ', 'retry_limit');
    }
}
