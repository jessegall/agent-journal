<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Support\Facades\File;
use Symfony\Component\Yaml\Yaml;

/**
 * Every service that runs the application image gets the journal's one shared environment, so a step the queue or the
 * ticker runs knows the same settings as the web app.
 */
final class ComposeEnvironmentTest extends TestCase
{
    private const string APPLICATION_IMAGE = '${COMPOSE_PROJECT_NAME}-app';

    private const string SHARED_ENVIRONMENT = 'x-journal-environment';

    public function test_every_service_on_the_application_image_shares_the_journals_environment(): void
    {
        $this->assertSame([], $this->servicesWithoutTheEnvironment(base_path('compose.yaml')));
    }

    public function test_a_service_without_the_shared_environment_is_caught(): void
    {
        $fixture = base_path('tests/Fixtures/Architecture/Compose/missing-environment.yaml');

        $this->assertSame(['queue'], $this->servicesWithoutTheEnvironment($fixture));
    }

    /**
     * @return list<string>
     */
    private function servicesWithoutTheEnvironment(string $composeFile): array
    {
        /** @var array{services: array<string, array<string, mixed>>, x-journal-environment?: array<string, string>} $compose */
        $compose = Yaml::parse(File::get($composeFile));
        $shared = $compose[self::SHARED_ENVIRONMENT] ?? null;
        $faults = [];

        foreach ($compose['services'] as $name => $service) {
            if (($service['image'] ?? null) === self::APPLICATION_IMAGE && ($service['environment'] ?? null) !== $shared) {
                $faults[] = $name;
            }
        }

        return $faults;
    }
}
