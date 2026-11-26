<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Contracts\CommandLines\Condition;
use App\Contracts\Drivers\AccountEnvironmentPart;
use App\Contracts\Drivers\AccountPlanPart;
use App\Contracts\Drivers\EnvironmentPart;
use App\Contracts\Drivers\PlanPart;
use App\Exceptions\DriverSetupInvalid;
use App\Support\CommandLines\Negation;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;
use App\Values\PlanAddition;
use Illuminate\Contracts\Container\Container;

/**
 * A part of a driver's setup, named by its class, that applies to a start while its condition holds; an account part
 * applies only to a start on an account and is handed that account.
 */
final readonly class ConditionalPart
{
    /**
     * @param  Condition<DriverStart>  $condition
     * @param  class-string<EnvironmentPart|AccountEnvironmentPart|PlanPart|AccountPlanPart>  $part
     */
    private function __construct(private Condition $condition, public string $part, private bool $isForAccount) {}

    /**
     * @param  Condition<DriverStart>  $condition
     * @param  class-string<EnvironmentPart|PlanPart>  $part
     */
    public static function for(Condition $condition, string $part): self
    {
        return new self($condition, $part, false);
    }

    /**
     * @param  Condition<DriverStart>  $condition
     * @param  class-string<EnvironmentPart|PlanPart>  $part
     */
    public static function unless(Condition $condition, string $part): self
    {
        return new self(new Negation($condition), $part, false);
    }

    /**
     * @param  Condition<DriverStart>  $condition
     * @param  class-string<AccountEnvironmentPart|AccountPlanPart>  $part
     */
    public static function forAccount(Condition $condition, string $part): self
    {
        return new self($condition, $part, true);
    }

    public function appliesTo(DriverStart $start): bool
    {
        return (! $this->isForAccount || $start->account !== null) && $this->condition->holdsFor($start);
    }

    /**
     * What an environment part adds to the start; a part of another kind declared there refuses the setup.
     *
     * @throws DriverSetupInvalid
     */
    public function environmentFor(DriverStart $start, Container $container): EnvironmentAddition
    {
        $answer = $this->answerFor($start, $container);

        if ($answer instanceof EnvironmentAddition) {
            return $answer;
        }

        throw DriverSetupInvalid::partInWrongList($this->part, 'environment');
    }

    /**
     * What a plan part adds to the start; a part of another kind declared there refuses the setup.
     *
     * @throws DriverSetupInvalid
     */
    public function planFor(DriverStart $start, Container $container): PlanAddition
    {
        $answer = $this->answerFor($start, $container);

        if ($answer instanceof PlanAddition) {
            return $answer;
        }

        throw DriverSetupInvalid::partInWrongList($this->part, 'start plan');
    }

    /**
     * What the part adds to the start, built by the container; called only once the part applies.
     */
    private function answerFor(DriverStart $start, Container $container): EnvironmentAddition|PlanAddition
    {
        $part = $container->make($this->part);

        if ($part instanceof AccountEnvironmentPart || $part instanceof AccountPlanPart) {
            return $part($start, $start->account ?? throw DriverSetupInvalid::accountPartWithoutAccount($this->part));
        }

        return $part($start);
    }
}
