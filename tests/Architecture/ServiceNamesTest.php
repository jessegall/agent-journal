<?php

declare(strict_types=1);

namespace Tests\Architecture;

/**
 * A class that carries out the operations of one subject is named <Subject>Service, never with a suffix of its own:
 * a Support class whose name ends in a gerund fails, unless it is on the list of those that are no service.
 */
final class ServiceNamesTest extends TestCase
{
    /**
     * Support classes named with a gerund that are no service, each with what it is.
     */
    private const array NOT_SERVICES = [
        'ArrangementSetting' => 'the configured arrangement, a value read once',
        'AuditPruning' => 'the result of one audit prune',
        'CommandNesting' => 'the nesting depth of the request in hand',
        'DispatcherFactStaging' => 'an implementation of the FactStaging contract',
        'OpenTiming' => 'an implementation of the VerificationTiming contract',
        'PhaseTiming' => 'an implementation of the VerificationTiming contract',
        'StartSetting' => 'one named value a host sets for a start',
        'TextReading' => 'a bounded read of a text, a value',
        'RecordReading' => 'a bounded read of a document or report, a value',
        'ActorProvisioning' => 'the only implementation of the ActorProvisioning contract, named after it',
        'OutputDocking' => 'a dockable provider',
        'RunDocking' => 'a dockable provider',
        'DocumentDocking' => 'a dockable provider',
        'ReportDocking' => 'a dockable provider',
        'PlanDocking' => 'a dockable provider',
        'SequenceRunDocking' => 'a dockable provider',
        'TaskDocking' => 'a dockable provider',
    ];

    public function test_no_support_class_is_named_with_a_gerund_of_its_own(): void
    {
        $files = [...glob(app_path('Support/*ing.php')) ?: [], ...glob(base_path('domain/*/src/Support/*ing.php')) ?: []];
        $names = array_map(fn (string $file) => basename($file, '.php'), $files);

        $this->assertSame([], array_values(array_diff($names, array_keys(self::NOT_SERVICES))));
    }
}
