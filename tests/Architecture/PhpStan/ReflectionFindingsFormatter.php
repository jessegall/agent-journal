<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PHPStan\Analyser\Error;
use PHPStan\Command\AnalysisResult;
use PHPStan\Command\ErrorFormatter\ErrorFormatter;
use PHPStan\Command\Output;

/**
 * Writes what RawReflectionRule found as JSON for ReflectionBoundaryTest: how many files were analysed, anything that
 * kept the analysis from completing, and each finding with its file, line, operation and enclosing declaration.
 */
final class ReflectionFindingsFormatter implements ErrorFormatter
{
    public function formatErrors(AnalysisResult $analysisResult, Output $output): int
    {
        $errors = $analysisResult->getFileSpecificErrors();
        $findings = array_filter($errors, fn (Error $error) => $error->getIdentifier() === 'reflection.raw');
        $unparsed = array_filter($errors, fn (Error $error) => $error->getIdentifier() === 'phpstan.parse');

        $output->writeRaw((string) json_encode([
            'analysedFiles' => count($analysisResult->getProcessedFiles()),
            'failures' => [
                ...array_map(fn ($error) => $error->getMessage(), $analysisResult->getInternalErrorObjects()),
                ...$analysisResult->getNotFileSpecificErrors(),
                ...array_map(fn (Error $error) => "{$error->getFilePath()}: {$error->getMessage()}", array_values($unparsed)),
            ],
            'findings' => array_map(fn (Error $error) => [
                'file' => $error->getFilePath(),
                'line' => $error->getLine() ?? 0,
                'message' => $error->getMessage(),
                'operation' => $error->getMetadata()['operation'] ?? '',
                'declaration' => $error->getMetadata()['declaration'] ?? '',
            ], array_values($findings)),
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

        return 0;
    }
}
