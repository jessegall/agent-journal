<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use PHPUnit\Event\Code\TestMethod;
use PHPUnit\Event\Test\Finished;
use PHPUnit\Event\Test\FinishedSubscriber;
use PHPUnit\Event\Test\PreparationStarted;
use PHPUnit\Event\Test\PreparationStartedSubscriber;
use PHPUnit\Event\Test\Prepared;
use PHPUnit\Event\Test\PreparedSubscriber;
use PHPUnit\Runner\Extension\Extension;
use PHPUnit\Runner\Extension\Facade;
use PHPUnit\Runner\Extension\ParameterCollection;
use PHPUnit\TextUI\Configuration\Configuration;

/**
 * Gives every test a time limit (TestAlarm): a test that runs past it fails by name instead of stalling the run.
 */
final class TimeLimitExtension implements Extension
{
    public function bootstrap(Configuration $configuration, Facade $facade, ParameterCollection $parameters): void
    {
        if (! TestAlarm::isAvailable()) {
            return;
        }

        $facade->registerSubscribers(
            new class implements PreparationStartedSubscriber
            {
                public function notify(PreparationStarted $event): void
                {
                    TestAlarm::armForPreparation($event->test()->id());
                }
            },
            new class implements PreparedSubscriber
            {
                public function notify(Prepared $event): void
                {
                    $test = $event->test();

                    if ($test instanceof TestMethod) {
                        TestAlarm::armForTest($test->className(), $test->methodName());
                    }
                }
            },
            new class implements FinishedSubscriber
            {
                public function notify(Finished $event): void
                {
                    TestAlarm::disarm();
                }
            },
        );
    }
}
