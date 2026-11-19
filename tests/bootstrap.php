<?php

declare(strict_types=1);

/*
 * The tests run only inside the project's Docker containers, against their Postgres and Redis; on the host they would
 * reach other services or none, so a run outside Docker stops here with the command to use instead.
 */
if (! file_exists('/.dockerenv')) {
    fwrite(STDERR, "The tests run only inside Docker: docker compose -p agent-journal-6 exec -T queue composer test\n");

    exit(1);
}

$loader = require __DIR__.'/../vendor/autoload.php';

/*
 * A worker's test copy shares the main checkout's vendor, whose optimized classmap and PSR-4 roots point at the main
 * checkout's files. They are pointed at the copy's own files, so a class the worker added, changed or renamed is the
 * one its tests run.
 */
$checkout = (string) realpath(dirname(__DIR__));
$builtFor = dirname((string) realpath(dirname(__DIR__).'/vendor/composer/ClassLoader.php'), 3);

if ($builtFor !== $checkout) {
    $composer = json_decode((string) file_get_contents($checkout.'/composer.json'), true, flags: JSON_THROW_ON_ERROR);

    foreach ([...$composer['autoload']['psr-4'], ...$composer['autoload-dev']['psr-4']] as $namespace => $folder) {
        $loader->setPsr4($namespace, $checkout.'/'.$folder);
    }

    $ownFiles = [];

    foreach ($loader->getClassMap() as $class => $file) {
        $real = (string) realpath($file);

        if (str_starts_with($real, $builtFor.'/') && ! str_starts_with($real, $builtFor.'/vendor/')) {
            $ownFiles[$class] = $checkout.substr($real, strlen($builtFor));
        }
    }

    $loader->addClassMap($ownFiles);
}
